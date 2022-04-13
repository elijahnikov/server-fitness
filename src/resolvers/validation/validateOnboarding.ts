export const validateOnboarding = (
    currentWeight: number,
    goalWeight: number,
    heightFeet: number,
    heightInches: number,
    age: number,
    gender: string,
    activityLevel: string
) => {
    
    if (!currentWeight || 
        !goalWeight || 
        !heightFeet || 
        !heightInches || 
        !age || 
        !gender || 
        !activityLevel)
    {
        return [
            {
                field: "gender",
                message: "Please ensure you have completed all fields."
            }
        ]
    }

    return null

}