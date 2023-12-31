import * as Contacts from "expo-contacts";
import * as Linking from "expo-linking";
import { ContactShema } from "../../app/modal";
import useContactStore from "./contactSlice";

export async function fetchContacts(listContact: ContactShema[]) {
  const { addContact } = useContactStore((state) => state);
  if (listContact.length === 0) {
    const { status } = await Contacts.requestPermissionsAsync();
    console.log({ status });
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        rawContacts: true,
        sort: "firstName",
      });

      if (data.length > 0) {
        let contact = data.filter((c) => c.phoneNumbers !== undefined);
        const mappedContacts = contact.map((contact) => {
          const phoneNumbers = contact.phoneNumbers?.map((phoneNumber) => ({
            number: phoneNumber.number,
          }));
          return { id: contact.id, name: contact.name, phoneNumbers };
        });
        if (mappedContacts.length > 0) {
          //@ts-ignore
          addContact(mappedContacts);
        }
      }
    } else {
      console.log("contact");
      Linking.openSettings();
    }
  }
}
