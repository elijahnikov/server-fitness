import { User } from "../../entities/userEntity";
import { _Context } from "../../types";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { validateRegister } from "../validation/validateRegister";
import argon2 from "argon2";
import { getConnection } from "typeorm";
import { WeightHistory } from "../../entities/weightHistoryEntity";
import { calculateCalories } from "../../utils/calorieTargetAlgo";
import aws from 'aws-sdk'

@ObjectType()
class FieldError 
{
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse 
{
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@ObjectType()
class S3Payload {
    @Field(() => String)
    signedRequest: String
    
    @Field(() => String)
    url: String
}

@ObjectType()
class GetWeightHistory 
{
    @Field(() => [WeightHistory])
    weightHistory: WeightHistory[]
}

@Resolver(User)
export class UserResolver {
    
    @Query(() => User, {nullable: true})
    async me(
        @Ctx() {req}: _Context
    )
    {
        if (!req.session.userId){
            return null
        }
        return User.findOne(req.session.userId);
    }

    //REGISTER MUTATION
    @Mutation(() => UserResponse)
    async register(
        @Arg("email") email: string,
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() {req}: _Context
    ): Promise<UserResponse>
    {
        //validate the input
        const errors = validateRegister(username, email, password);
        if (errors)
        {
            return {errors}
        }

        const hashedPwd = await argon2.hash(password)
        let user;
        try 
        {
            user = await User.create({
                username: username,
                email: email,
                password: hashedPwd
            }).save()
        } catch (err)
        {
            console.log(err)
            if (err.detail.includes(`(username)=(${username}) already exists`))
            {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already exists. Please try another."
                        }
                    ]
                }
            }

            if (err.detail.includes(`(email)=(${email}) already exists`))
            {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "E-mail has been taken. Please try another."
                        }
                    ]
                }
            }
        }

        req.session.userId = user?.id
        return {
            user
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() {req}: _Context
    ): Promise<UserResponse>
    {
        const user = await User.findOne({where: {email: email}})

        if (!user)
        {
            return {
                errors: [
                    {
                        field: "email",
                        message: "Incorrect details."
                    }
                ]
            }
        }

        const passwordCheck = await argon2.verify(user.password, password)
        if (!passwordCheck)
        {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect details."
                    }
                ]
            }
        }

        req.session.userId = user.id;
        return {
            user
        }
    }

    @Mutation(() => UserResponse)
    async editUserDetails(
        @Arg("displayName", {nullable: true}) displayName: string,
        @Arg("currentWeight", () => Int, {nullable: true}) currentWeight: number,
        @Arg("goalWeight", () => Int, {nullable: true}) goalWeight: number,
        @Arg("heightFeet", () => Int, {nullable: true}) heightFeet: number,
        @Arg("heightInches", () => Int, {nullable: true}) heightInches: number,
        @Arg("age", () => Int, {nullable: true}) age: number,
        @Arg("gender", {nullable: true}) gender: string,
        @Arg("activityLevel", {nullable: true}) activityLevel: string,
        @Arg("avatar", {nullable: true}) avatar: string,
        @Ctx() {req}: _Context
    ) : Promise<UserResponse>
    {

        const calorieTarget = calculateCalories(
            age, 
            gender, 
            heightFeet, 
            heightInches, 
            currentWeight, 
            goalWeight, 
            activityLevel)

        const {userId} = req.session
        let user;
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({
                    displayName: displayName,
                    currentWeight: currentWeight,
                    goalWeight: goalWeight,
                    heightFeet: heightFeet,
                    heightInches: heightInches,
                    age: age,
                    gender: gender,
                    activityLevel: activityLevel,
                    calorieTarget: calorieTarget,
                    avatar: avatar
                })
                .where("id = :id", {id: userId})
                .returning("*")
                .execute()
            user = result.raw[0]
        }
        catch (err)
        {
            console.log(err)
        }

        const weightCheck = await WeightHistory.findOne({where: {userId: req.session.userId}})
        if (!weightCheck)
        {
            await getConnection()
            .createQueryBuilder()
            .insert()
            .into(WeightHistory)
            .values({weight: currentWeight, userId: req.session.userId, previousWeight: currentWeight})
            .execute()
        }

        return {
            user
        }
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: _Context
    )
    {
        return new Promise((resolve) => req.session.destroy((err) => 
        {
            res.clearCookie("FYPCOOKIE");
            if (err)
            {
                console.log(err)
                resolve(false)
                return;
            }
            else
            {
                resolve(true)
            }
        }))
    }

    @Query(() => GetWeightHistory)
    async getWeightHistoryByUser(
        @Ctx() {req}: _Context
    ): Promise<GetWeightHistory | undefined>
    {
        const {userId} = req.session

        const results = getConnection()
            .getRepository(WeightHistory)
            .createQueryBuilder("wh")
            .take()
            .where("wh.userId = :id", {id: userId})
        
        const weightHistory = await results.getMany()
        
        return { weightHistory: weightHistory }
    }

    @Mutation(() => S3Payload)
    async signS3(
        @Arg('filename') filename: string,
        @Arg('filetype') filetype: string
    ): Promise<S3Payload | undefined>
    {

        const s3 = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        })

        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Expires: 60,
            ContentType: filetype,
            ACL: 'public-read'
        }

        const signedRequest = await s3.getSignedUrl('putObject', s3Params)
        const url = `https://fitnessappstorage.s3.amazonaws.com/${filename}`

        return {
            signedRequest,
            url
        }
    }
}