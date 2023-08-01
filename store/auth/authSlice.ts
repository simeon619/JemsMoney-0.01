// This is the initial state of the slice
// const initialState: { isAuthenticated: boolean } = {
//   // user: null,
//   isAuthenticated: false,
//   // account: null,

import { SQuery } from "..";
import { AccountInterface } from "../Descriptions";

// };
const initialState: {
  user: any;
  isAuthenticated: boolean;
  account: any;
  loading: boolean;
} = {
  user: null,
  isAuthenticated: false,
  account: null,
  loading: false,
};
// const router = useRouter();
const fetchUser = async (data: {
  telephone: string;
  password: string;
}): Promise<AccountInterface & { isAuthentificated: boolean }> => {
  try {
    const { telephone, password } = data;
    return new Promise((resolve: any, reject) => {
      SQuery.emit("login:user", { telephone, password }, async (res: any) => {
        if (res.error) {
          throw reject(res.error);
        }

        const account = await SQuery.newInstance("account", {
          id: res.response?.login.id,
        });

        if (!account) throw reject("Account not found");

        resolve({
          ...account.$cache,
        });
      });
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

const registerUser = async (data: {
  telephone: string;
  password: string;
  name: string;
  carte: string;
}) => {
  try {
    const { telephone, password, carte, name } = data;
    return new Promise((resolve: any, reject) => {
      SQuery.emit(
        "signup:user",
        {
          account: {
            name: name,
            password: password,
            telephone: telephone,
            carte: null,
            imgProfile: [],
          },
          contacts: [],
          transactions: [],
          messenger: {
            opened: [],
            closed: [],
          },
          preference: {
            nigthMode: false,
            currentDevise: "rub",
            watcthDifference: "rub/xof",
          },
        },
        async (res: any) => {
          if (res.error) {
            return reject(res.error);
          }

          const user = await SQuery.newInstance("user", {
            id: res.response,
          });

          if (!user) throw reject("User not found");

          return resolve({
            user: user.$cache,
            account: (await user.account)?.$cache,
          });
        }
      );
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { fetchUser, registerUser };
