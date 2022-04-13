export const validateRegister = (username: string, email: string, password: string) => 
{
    let emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email))
    {
        return [
            {
                field: "email",
                message: "Please enter a valid e-mail address."
            }
        ]
    }

    if (username.length <= 2)
    {
        return [
            {
                field: "username",
                message: "Username must be longer than 2 characters."
            }
        ]
        
    }

    if (username.includes("@"))
    {
        return [
            {
                field: "username",
                message: "Please enter a valid username."
            }
        ]
    }

    if (password.length <= 4)
    {
        return [
            {
                field: "password",
                message: "Password must be longer than 4 characters."
            }
        ]
    }

    return null;
}