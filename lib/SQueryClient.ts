import { io } from "socket.io-client";
import { HOST } from "../constants/data";
import {
  getMyStringValue,
  removeValue,
  setStringValue,
} from "../fonctionUtilitaire/metrics";
import { Config } from "./Config";
import { createModelFrom } from "./Model";
const Descriptions: any = {};
const socket = io(HOST);

(async () => {
  const cookie = await getMyStringValue("@cookie");
  console.log({ cookie });
  if (cookie)
    socket.io.opts.extraHeaders = {
      ...socket.io.opts.extraHeaders,
      cookie,
    };
})();

socket.on("storeCookie", async (cookie, cb) => {
  console.log("StoreCOOKIE", cookie);

  removeValue("@cookie");
  try {
    setStringValue("@cookie", cookie);
    socket.io.opts.extraHeaders = {
      ...socket.io.opts.extraHeaders,
      cookie,
    };
  } catch (error) {
    console.log("Error storing cookie:", error);
  }
  cb(cookie);
});

export const Global: any = {};

const SQuery = {
  model: async (modelPath: string) => {
    return await createModelFrom(modelPath);
  },
  authentification: async (modelPath: string) => {
    return await createModelFrom(modelPath);
  },
  socket,
  isInstance: async (instance: any) => {
    return (
      instance.$modelPath &&
      instance.$id &&
      instance.newParentInstance &&
      instance.update &&
      instance.when
    );
  },
  isArrayInstance: async (arrayInstance: any) => {
    return (
      arrayInstance.back &&
      arrayInstance.next &&
      arrayInstance.page &&
      arrayInstance.$itemModelPath &&
      arrayInstance.last &&
      arrayInstance.update &&
      arrayInstance.when
    );
  },
  isFileInstance: async (fileInstance: any) => {
    return false;
  },
  currentUserInstance: async () => {
    if (Global.userInstance) return Global.userInstance;
    return await new Promise((rev) => {
      SQuery.emit("server:currentUser", {}, async (res: any) => {
        if (res.error) rev(null); //throw new Error(JSON.stringify(res));
        const userModel: any = await SQuery.model(
          res.response.signup.modelPath
        );
        if (!userModel) rev(null); //throw new Error("Model is null for modelPath : " + res.modelPath);
        const userInstance = await userModel.newInstance({
          id: res.response.signup.id,
        });
        Global.userInstance = userInstance;
        rev(userInstance);
      });
    });
  },
  emitNow: (event: string, ...arg: any) => {
    if (typeof event != "string")
      throw new Error(
        "cannot emit with following event : " +
          event +
          "; event value must be string"
      );
    if (SQuery.socket.connected) {
      socket.emit(event, ...arg);
    } else {
      throw new Error("DISCONNECT FROM SERVER");
    }
  },
  emit: (event: string, ...arg: any) => {
    if (typeof event != "string")
      throw new Error(
        "cannot emit with following event : " +
          event +
          "; event value must be string"
      );
    socket.emit(event, ...arg);
  },
  on: (event: string, listener: Function) => {
    if (typeof event != "string")
      throw new Error(
        "cannot emit with following event : " +
          event +
          "; event value must be string"
      );
    socket.on(event, (...ert: any[]) => {
      listener(...ert);
    });
  },
  getDescription: async function (modelPath: string) {
    if (typeof modelPath != "string")
      throw new Error(
        "getDescription(" +
          modelPath +
          ") is not permit, parameter must be string"
      );
    if (Descriptions[modelPath]) {
      return Descriptions[modelPath];
    } else if (Config.dataStore.useStore) {
      const data = await Config.dataStore.getData(
        "server:description:" + modelPath
      );
      if (data) {
        return (Descriptions[modelPath] = data);
      }
    }
    return await new Promise((rev) => {
      // //console.//consolelog('********************');
      SQuery.emit(
        "server:description",
        {
          modelPath,
        },
        (res: { error: any; response: any }) => {
          // //console.log('server:description', res);
          if (res.error) throw new Error(JSON.stringify(res));
          Descriptions[modelPath] = res.response;
          Config.dataStore.setData(
            "server:description:" + modelPath,
            Descriptions[modelPath]
          );
          rev(Descriptions[modelPath]);
        }
      );
    });
  },
  getDescriptions: async function () {
    let descriptions: any;
    const data = await Config.dataStore.getData("server:descriptions");
    if (/*Config.dataStore.useStore*/ false && data) {
      descriptions = data;
    } else {
      descriptions = await new Promise((rev) => {
        SQuery.emit(
          "server:descriptions",
          {},
          (res: { error: any; response: unknown }) => {
            if (res.error) throw new Error(JSON.stringify(res));
            rev(res.response);
          }
        );
      });
      Config.dataStore.setData("server:descriptions", descriptions);
    }

    for (const modelPath in descriptions) {
      if (Object.hasOwnProperty.call(descriptions, modelPath)) {
        Descriptions[modelPath] = descriptions[modelPath];
        Config.dataStore.setData(
          "server:description:" + modelPath,
          descriptions[modelPath]
        );
      }
    }
    return Descriptions;
  },

  set dataStore(value) {
    Config.dataStore = {
      ...Config.dataStore,
      ...value,
    };
  },
  get dataStore() {
    return Config.dataStore;
  },

  service: async (ctrl: string, service: string, data: any): Promise<any> => {
    return await new Promise((rev) => {
      SQuery.emit(
        ctrl + ":" + service,
        data,
        async (res: { error: any; response: any }) => {
          if (res.error) {
            rev(null);
            // throw new Error(JSON.stringify(res));
            console.log(
              "🚀 ~ file: SQueryClient.ts:209 ~ JSON.stringify(res):",
              JSON.stringify(res)
            );
            return;
          }
          rev(res.response);
        }
      );
    });
  },
  newInstance: async (modelPath: string, data: { id: string }) => {
    const model = await SQuery.model(modelPath);
    const instance = await model.newInstance(data);
    return instance;
  },
};

export default SQuery;

// function getIP(callback){
//     fetch('https://api.ipregistry.co/?key=tryout')
//       .then(response => response.json())
//       .then(data => callback(data));
//   }
//   getIP(function(ip){
//   //console.log(ip);

//   });
