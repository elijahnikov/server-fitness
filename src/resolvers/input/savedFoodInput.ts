import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class SavedFoodInput {
    @Field({nullable: true})
    title: string;

    @Field({nullable: true})
    serving: number;

    @Field({nullable: true})
    calories: number;

    @Field({nullable: true})
    protein: number;

    @Field({nullable: true})
    carbs: number;

    @Field({nullable: true})
    fat: number;

    @Field({nullable: true})
    type: string;

    @Field({nullable: true})
    pictureUrl: string
}
