export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    return regex.test(email);
};

export const  getInitials = (name) =>{
    if(!name) return "";

    const words = name.split(" ");
    let initials ="";

    for(let i = 0; i<Math.min(words.length, 2); i++){
        initials += words[i][0];
    }

    return initials.toUpperCase();
};

export const generateRandomPassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password;
  }