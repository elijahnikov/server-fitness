export const calculateCalories = (
    age: number,
    gender: string,
    heightFeet: number,
    heightInches: number,
    weight: number,
    goalWeight: number,
    activityLevel: string) => {

    let calorieTarget = 0
    
    let bmr = 0, 
        constant = 0, 
        activityCoefficient = 0, 
        goalCoefficient = 0

    //convert height from feet and inches to cm
    let tempHeight = (heightFeet * 12) + heightInches
    let heightCm = tempHeight * 2.54

    //constant depending on gender
    if (gender == "Male") 
    {
        constant = 5
    }
    else if (gender == "Female") 
    {
        constant = -161
    }

    if (weight < goalWeight)
    {
        goalCoefficient = 300
    }
    else if (weight > goalWeight)
    {
        goalCoefficient = -300
    }
    else if (weight == goalWeight)
    {
        goalCoefficient = 0
    }

    switch(activityLevel)
    {
        case "Sedentary":
            activityCoefficient = 1.1
            break;
        case "Light":
            activityCoefficient = 1.2
            break;
        case "Moderate":
            activityCoefficient = 1.375
            break;
        case "Very Active":
            activityCoefficient = 1.55
            break;
    }

    //workout the bmr of the user from given details
    bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + constant

    //combine to calcalute rough estimate of what their calorie intake should be depending on
    //bmr, activity level, and their goal weight.
    calorieTarget = Math.round((bmr * activityCoefficient) + goalCoefficient)

    return calorieTarget
}