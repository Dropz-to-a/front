type User = {
  role: "company" | "user";
  form: {
    name: string;
    email: string;
    phone: string;
    birth: string;
    address: string;
    height: string;
    weight: string;
    blood: string;
    education: string;
    military: string;
    license: string;
    foreignLang: string;
    activity: string;
    family: string;
    hobby: string;
    motivation: string;
  };
  profile: {
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    joinDate: string;
    bio: string;
    trustScore: number;
    experience: {
      company: string;
      role: string;
      years: string;
      summary: string;
    }[];
    skills: string[];
    preferences: {
      jobType: string;
      salary: string;
      workStyle: string;
      startDate: string;
    };
  };
};