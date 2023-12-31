import { createInstanceFrom } from "./Instance";
import  { DescriptionSchema } from "./SQueryClient";




export async function createModelFrom<key>(modelPath: key , description:DescriptionSchema , SQuery:any): Promise<any> {
  const Model: any = {};
  Model.description = description;
  Model.create = async (data: any, errorCb: any): Promise<any> => {
    ///// verifier si chaque donner est bien rentrer

    if (!errorCb) errorCb = (e: any) => console.error(e);
    //NEW_ADD
    // const validation = await Validator(description, data);
    // if (validation.message) {
    //   // console.error(validation);
    //   errorCb({
    //     properties: validation,
    //   });
    //   return null;
    // }
    return await new Promise((rev) => {
      try {
        SQuery.emit(modelPath + ":create", data, async (res: any) => {
          try {
            if (res.error) {
              errorCb(res);
              return rev(null);
            }
            rev(await createInstanceFrom({ modelPath, id: res.response }));
          } catch (e) {
            errorCb(e);
            return rev(null);
          }
        });
      } catch (e) {
        errorCb(e);
        return rev(null);
      }
    });
  };
  /** ****************      Instance      ******************* */
  Model.newInstance = async (
    data: any,
    errorCb: any
  ): Promise<any> => {
    if (!errorCb) errorCb = (e: any) => console.error(e);
    let instance = null;
    try {
      try {
        // //console.log('*************', { modelPath, id: data.id, description });
        instance = await createInstanceFrom({ modelPath, id: data.id, Model });
      } catch (e) {
        errorCb(e);
      }
    } catch (e) {
      errorCb(e);
    }
    return instance;
  };

  Model.newParentInstance = async (
    { childInstance, childId }: any,
    errorCb: any
  ) => {
    if (!errorCb) errorCb = (e: any) => console.error(e);
    let parentInstance = null;
    let parentModelPath;
    let parentId;
    if (!childInstance) {
      childInstance = await createInstanceFrom({
        modelPath,
        id: childId,
        Model,
      });
    }
    try {
      try {
        parentId = await childInstance["$parentId"];
        parentModelPath = await childInstance["$parentModelPath"];
        const parentModel = await SQuery.createModel(parentModelPath);
        parentInstance = await parentModel.newInstance({ id: parentId });
      } catch (e) {
        errorCb(e);
      }
    } catch (e) {
      errorCb(e);
    }

    return parentInstance;
  };
  Model.update = async (data: any): Promise<any> => {

    return await new Promise((rev, rej) => {
      try {
        SQuery.emit(modelPath + ":update", data, (res: any) => {
          try {
            if (res.error) {
              console.log(`ERROR de mise a jour du modelPath:${modelPath} , id:${data.id}`,JSON.stringify(res));
              return rev(null);
            }
            ////*console.log('*************', { modelPath, id: res.response, description });
            rev(createInstanceFrom({ modelPath, id: res.response, Model }));
            //restCarte.text.value = JSON.stringify(res);
          } catch (e) {
            console.log(`ERROR creation d'instance du modelPath:${modelPath} , id:${data.id}`,JSON.stringify(e));
            rev(null);
          }
        });
      } catch (e) {
        console.log(`ERROR de mise a jour du modelPath:${modelPath} , id:${data.id}`,JSON.stringify(e));
        rev(null);
      }
    });
  };
  return Model;
}
