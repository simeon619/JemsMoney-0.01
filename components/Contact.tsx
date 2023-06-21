import { Entypo, FontAwesome } from "@expo/vector-icons";
import getSymbolFromCurrency from "currency-symbol-map";
import { Image } from "expo-image";
import * as Localization from "expo-localization";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import phone from "phone";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { MagicModalPortal, magicModal } from "react-native-magic-modal";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/Colors";
import { normeFormat } from "../fonctionUtilitaire/data";
import { formatAmount } from "../fonctionUtilitaire/formatAmount";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { TransactionServer } from "../fonctionUtilitaire/type";
import { AppDispatch, RootState } from "../store";
import { Agency } from "../store/country/countrySlice";
import { updateTransaction } from "../store/transaction/transactionSlice";
import { MonoText } from "./StyledText";
import { ScrollView, Text, View } from "./Themed";

const Contact = ({
  user,
  changeTOProofPayment,
  changeFrame,
  transactionId,
  dataSavedTransaction,
}: {
  user: {
    isValid: boolean;
    code: string;
    name: string;
    id: string;
    number: string;
  };
  changeTOProofPayment: (
    sent: { value: number; currency: string },
    received: { value: number; currency: string },
    page: number,
    agenceSender: Agency,
    senderFile?: string
  ) => void;
  transactionId: string;
  dataSavedTransaction: TransactionServer | undefined;
  changeFrame: (page: number) => void;
}) => {
  const country = useSelector((state: RootState) => state.country);
  const { rates, serviceCharge } = useSelector(
    (state: RootState) => state.entreprise
  );
  const { currency: CuurencyPreference, country: countryPreference } =
    useSelector((state: RootState) => state.preference);

  console.log({ countryPreference });

  const colorSheme = useColorScheme();

  const [locale, setLocale] = useState<Localization.Locale>();

  const [countryId, setCountryId] = useState<string>("");
  const [currencyReceiver, setCurrencyReceiver] = useState<string>(
    country[""]?.currency
  );
  const [currentCurrency, setCurrentCurrency] =
    useState<string>(CuurencyPreference);
  const [amount, setAmount] = useState<string>("");
  const [name, setName] = useState<string>(user?.name);
  const [valid, setValid] = useState<boolean>(Boolean(user?.isValid));
  const [change, setChange] = useState<number>();
  const [cardSb, setCardSb] = useState<string>("");
  const [service, setService] = useState<Agency[]>();
  const [fee, setFee] = useState<number>(0.05);
  const [agenceReceiver, setAgenceReceiver] = useState<Agency>();
  const [agenceSender, setAgenceSender] = useState<Agency>();
  const [number, setNumber] = useState<string>(() => {
    let number = user?.number?.replace(/\s/g, "");

    return (
      parsePhoneNumberFromString(
        String(country[countryId]?.indicatif + number)
      )?.formatNational() || number
    );
  });
  let montant =
    parseFloat(amount.replace(/\s/g, "").replace(",", ".")) * (change || 1);

  let taxes = fee * montant;

  const dispatch: AppDispatch = useDispatch();
  const amountReceived = formatAmount(montant - taxes)
    .replace(",", ".")
    .replace(",00", "");
  console.log(formatAmount(montant - taxes).replace(",", "."));

  useEffect(() => {
    const fetchLocale = async () => {
      let local = Localization.getLocales();
      setLocale(local[local.length - 1]);
    };

    fetchLocale();
  }, []);

  useEffect(() => {
    setCountryId(dataSavedTransaction?.country || "");

    setCurrencyReceiver(country[dataSavedTransaction?.country || ""]?.currency);
    setCurrentCurrency(
      dataSavedTransaction?.sent?.currency || CuurencyPreference
    );
    setAmount(() => {
      if (!dataSavedTransaction?.sent?.value) return "";
      const cleanValue = String(dataSavedTransaction?.sent?.value)?.replace(
        /[^0-9a-z]/g,
        ""
      );
      const formattedValue = parseFloat(cleanValue).toLocaleString("CI");
      return formattedValue.replace("NaN", "");
    });
    setName(user?.name || dataSavedTransaction?.receiverName || "");
    setValid(Boolean(user?.isValid));
    setChange(
      rates[
        currentCurrency +
          "to" +
          country[dataSavedTransaction?.country || ""]?.currency
      ]
    );
    setCardSb(dataSavedTransaction?.carte || "");

    let number =
      user?.number?.replace(/\s/g, "") || dataSavedTransaction?.telephone;
    const indicatifLength =
      user?.code?.length ||
      country[dataSavedTransaction?.country || ""]?.indicatif?.length;

    if (number) {
      number = number.slice(indicatifLength);
    } else {
      number = user?.number?.replace(/\s/g, "");
    }
    if (user?.code) {
      Object.keys(country).forEach((id) => {
        if (country[id].indicatif === user?.code) {
          setCountryId(id);
        }
      });
    }

    const phoneNumber = parsePhoneNumberFromString(
      String(country[countryId]?.indicatif + number)
    );

    setNumber(phoneNumber?.formatNational() || number);
    // setNumber(phoneNumber);
  }, [
    dataSavedTransaction,
    country,
    rates,
    // currentCurrency,
    normeFormat,
    user,
  ]);

  useEffect(() => {
    // setFee(
    //   serviceCharge +
    //     (country[dataSavedTransaction?.country || ""]?.charge || 0) +
    //     (agence?.charge || 0)
    // );
    console.log(agenceReceiver?.charge || "0.02");
  }, [agenceReceiver]);
  useEffect(() => {
    setCurrencyReceiver(country[countryId]?.currency);
    setFee(
      +serviceCharge +
        +(agenceReceiver?.charge || "0.02") +
        +(agenceSender?.charge || "0.02")
    );
  }, [countryId, agenceReceiver, agenceSender]);

  useEffect(() => {
    let validnumber = country[countryId]?.indicatif
      ? country[countryId]?.indicatif + number
      : user.code + number;
    let resultPhone = phone(validnumber, { country: undefined });
    setValid(resultPhone.isValid);
    setAgenceReceiver(undefined);

    setService(country[countryId]?.agency);
    country[countryId]?.agency.forEach((agence) => {
      console.log(
        "🚀 ~ file: Contact.tsx:203 ~ country[countryId]?.agency.forEach ~ agence:",
        agence
      );
      if (agence.id === dataSavedTransaction?.agenceReceiver) {
        setAgenceReceiver(agence);
      }
      if (agence.id === dataSavedTransaction?.agenceSender) {
        setAgenceSender(agence);
      }
    });
  }, [countryId, number]);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      if (agenceReceiver && agenceSender && dataSavedTransaction?.senderFile) {
        isFirstMount.current = false;
        const timer = setTimeout(() => {
          changeTOProofPayment(
            dataSavedTransaction.sent,
            dataSavedTransaction.received,
            2,
            agenceSender,
            dataSavedTransaction.senderFile
          );
        });
        return () => {
          clearTimeout(timer);
          isFirstMount.current = true;
        };
      }
    }
  }, [agenceSender, dataSavedTransaction?.senderFile]);

  useEffect(() => {
    setChange(rates[currentCurrency + "to" + currencyReceiver]);
  }, [currencyReceiver, currentCurrency]);

  const ServiceSenderModal = () => {
    const renderItem = ({ item }: { item: Agency }) => {
      //@ts-ignore
      // item.
      return (
        <TouchableOpacity
          onPress={() => {
            magicModal.hide(<ServiceSenderModal />);
            setAgenceSender(item);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: moderateScale(10),
          }}
        >
          <MonoText
            style={{
              fontSize: moderateScale(20),
              textAlign: "left",
              paddingVertical: verticalScale(10),
            }}
          >
            {item?.name}
          </MonoText>
          <Image
            source={item?.icon}
            contentFit="contain"
            style={{
              width: horizontalScale(60),
              aspectRatio: 1,
              // marginRight: 5,
              // paddingVertical: moderateScale(15),
            }}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          data={country[countryPreference.id]?.agency || []}
          //@ts-ignore
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  const ServiceModal = () => {
    const renderItem = ({ item }: { item: Agency }) => {
      //@ts-ignore
      // item.
      return (
        <TouchableOpacity
          onPress={() => {
            magicModal.hide(<ServiceModal />);
            setAgenceReceiver(item);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: moderateScale(10),
          }}
        >
          <MonoText
            style={{
              fontSize: moderateScale(20),
              textAlign: "left",
              paddingVertical: verticalScale(10),
            }}
          >
            {item?.name}
          </MonoText>
          <Image
            source={item?.icon}
            contentFit="contain"
            style={{
              width: horizontalScale(60),
              aspectRatio: 1,
              // marginRight: 5,
              // paddingVertical: moderateScale(15),
            }}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          data={service}
          //@ts-ignore
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };
  const ChangeCurrentcurency = () => {
    const change = new Set<string>();

    Object.keys(rates).forEach((rateKey) => {
      const currencyCode = rateKey.substring(0, 3);
      change.add(currencyCode);
    });
    const renderItem = ({ item }: { item: string }) => {
      //@ts-ignore
      // item.
      return (
        <TouchableOpacity
          onPress={() => {
            setCurrentCurrency(item);
            magicModal.hide();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // gap: moderateScale(5),
          }}
        >
          <MonoText
            style={{
              fontSize: moderateScale(20),
              textAlign: "left",
              paddingVertical: verticalScale(10),
            }}
          >
            {item} - {getSymbolFromCurrency(item)}
          </MonoText>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          data={[...change]}
          //@ts-ignore
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  };
  const ResponseModal = () => {
    const renderItem = ({ item }: { item: any }) => {
      const countr = country[item];
      if (!countr?.name) {
        return <></>;
      }
      return (
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            setCountryId(country[item]?.id);
            magicModal.hide();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: verticalScale(15),
          }}
        >
          <Image
            source={countr?.icon}
            contentFit="contain"
            style={{
              width: horizontalScale(30),
              height: verticalScale(30),
              marginRight: 5,
              // paddingVertical: moderateScale(15),
            }}
          />
          <MonoText style={{ fontSize: moderateScale(18) }}>
            {countr?.name}
          </MonoText>
          <Text style={{ marginLeft: 10 }}>{countr?.indicatif}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          //@ts-ignore
          data={Object.keys(country)}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  };

  const handleChangeText = (text: string) => {
    const cleanValue = text.replace(/[^0-9a-z]/g, "");
    const formattedValue = parseFloat(cleanValue).toLocaleString("CI");
    setAmount(formattedValue.replace("NaN", ""));
  };

  function handleNumber(txt: string) {
    const phoneNumber = parsePhoneNumberFromString(
      country[countryId]?.indicatif + txt,
      (locale?.regionCode as any) || "CI"
    );

    setNumber(phoneNumber?.formatNational() || txt);
  }
  function verifyAndNext(): void {
    let realNumber = country[countryId]?.indicatif + number;
    const phoneNumber = parsePhoneNumberFromString(realNumber);
    console.log(
      "🚀 ~ file: Contact.tsx:384 ~ verifyAndNext ~ phoneNumber:",
      phoneNumber?.formatInternational()
    );
    //  received :{ value : formatAmount(montant - taxes).replace(",00", ""), currency : currencyReceiver}
    //  sent :{ value : amount.replace(/\s/g, "") , currency : currentCurrency}
    const nameRegex = /^[A-Za-z]+$/;
    // let testAgence =
    //   agence?.name === "ORANGE MONEY" || agence === "MTN MONEY" || agence === "WAVE";
    // let testName = /^[a-zA-ZÀ-ÖØ-öø-ſÇ-üŸ-ÿ\s-]+$/.test(name) || /^[а-яА-ЯёЁ]+$/.test(name);

    if (!!agenceSender?.name && !!agenceSender?.name && name?.length >= 3) {
      // changeTOProofPayment(amount, 1, agence, currentCurrency);
      changeTOProofPayment(
        { value: +amount.replace(/\s/g, ""), currency: currentCurrency },
        {
          value: +amountReceived.replace(/\s/g, ""),
          currency: currencyReceiver,
        },
        1,
        agenceSender
      );
      dispatch(
        updateTransaction({
          data: {
            telephone: realNumber.replace(/\s/g, ""),
            agenceReceiver: agenceReceiver?.id,
            agenceSender: agenceSender.id,
            country: countryId,
            received: {
              value: +amountReceived.replace(/\s/g, ""),
              currency: currencyReceiver,
            },
            sent: {
              value: +amount.replace(/\s/g, ""),
              currency: currentCurrency,
            },
            receiverName: name,
            carte: cardSb,
            codePromo: "jems545",
            typeTransaction: !!cardSb ? "carte" : "number",
            id: transactionId,
            // typeTransaction: "agence",
          },
        })
      );
      console.log(
        "🚀 ~ file: Contact.tsx:218 ~ verifyAndNext ~ transactionId:",
        transactionId
      );

      console.log({ valid, agenceReceiver, realNumber });
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      lightColor="#f6f7fb"
      style={{
        flex: 1,
        paddingHorizontal: horizontalScale(15),
        marginTop: verticalScale(10),
        gap: 20,
      }}
    >
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={10}
        style={{ flex: 1 }}
      >
        <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(17), fontWeight: "500" }}
          >
            Nom du Receveur
          </Text>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
              name?.length < 3 && { borderWidth: 0.4, borderColor: "#e42" },
            ]}
          >
            <TouchableOpacity
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="user"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            <TextInput
              // maxLength={10}
              placeholder="full name"
              value={name}
              onChangeText={(txt) => setName(txt)}
              keyboardType="name-phone-pad"
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(0),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(18),
              }}
            />
          </View>
          {name?.length < 3 ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              name invalid
            </Text>
          ) : (
            <Text />
          )}
        </View>

        <View lightColor="#f6f7fb">
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(17), fontWeight: "500" }}
          >
            Numero du receveur
          </Text>

          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
              !valid && { borderWidth: 0.4, borderColor: "#e42" },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ResponseModal />);
              }}
              style={{
                // flex: 4,
                // justifyContent: "center",
                alignItems: "center",

                gap: moderateScale(1),
                flexDirection: "row",
                // borderRightColor: "#b2c5ca",
                // borderRightWidth: 1,
                paddingHorizontal: horizontalScale(5),
              }}
            >
              <Entypo name="chevron-down" size={25} color={"#b2c5ca"} />
              <Text
                // lightColor="#444"
                style={{
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              >
                {country[countryId]?.indicatif || user?.code || "+1"}
              </Text>
            </TouchableOpacity>
            <TextInput
              // maxLength={
              //   parseInt(country[countryId]?.digit) || user.number?.length
              // }
              value={number}
              placeholder="0565848273"
              onChangeText={(txt) => {
                handleNumber(txt);
              }}
              keyboardType="phone-pad"
              style={{
                flex: 10,
                // paddingHorizontal: horizontalScale(15),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(18),
              }}
            />

            <TouchableOpacity
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={[country[countryId]?.icon]}
                style={{ width: moderateScale(30), aspectRatio: 1 }}
              />
            </TouchableOpacity>
          </View>

          {!valid ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              format invalid
            </Text>
          ) : (
            <Text />
          )}
        </View>

        {country[countryId]?.name === "russie" ? (
          <View lightColor="#f6f7fb">
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Card
            </Text>
            <View
              style={[
                {
                  flexDirection: "row",
                  margin: verticalScale(8),
                  borderRadius: 10,
                },
                shadow(1),
              ]}
            >
              <TouchableOpacity
                style={{
                  //   flex: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: horizontalScale(10),
                }}
              >
                <Text
                  lightColor="#b2c5ca"
                  style={{
                    fontSize: moderateScale(16),
                    borderRightColor: "#b2c5ca",
                    borderRightWidth: 1,
                    paddingRight: horizontalScale(5),
                  }}
                >
                  SBERBANK
                </Text>
              </TouchableOpacity>
              <TextInput
                // maxLength={10}
                value={cardSb}
                onChangeText={(txt) => {
                  setCardSb;
                }}
                keyboardType="number-pad"
                style={{
                  flex: 10,
                  paddingHorizontal: horizontalScale(0),
                  paddingVertical: verticalScale(8),
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              />
            </View>
          </View>
        ) : valid ? (
          <View lightColor="#f6f7fb">
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(17), fontWeight: "500" }}
            >
              Mode retrait
            </Text>

            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ServiceModal />);
              }}
              style={[
                {
                  //   flex: 3,
                  // justifyContent: "center",
                  // alignItems: "center",
                  // paddingHorizontal: horizontalScale(0),
                  borderRadius: 10,
                  margin: verticalScale(8),
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingVertical: verticalScale(10),
                  // paddingHorizontal: horizontalScale(5),
                  backgroundColor: "white",
                },
                shadow(1),
              ]}
            >
              <Entypo
                name="chevron-down"
                size={30}
                color={"#b2c5ca"}
                style={{
                  position: "absolute",
                  left: horizontalScale(10),
                  bottom: verticalScale(5),
                }}
              />
              <Text
                lightColor="#b2c5ca"
                style={{
                  fontSize: moderateScale(18),
                  // paddingHorizontal: horizontalScale(10),
                  textAlign: "center",
                  // backgroundColor: "red",
                }}
              >
                {agenceReceiver?.name}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {!!agenceReceiver?.charge && (
          <View lightColor="#f6f7fb">
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(17), fontWeight: "500" }}
            >
              Montant reel reçu. (Avec frais)
            </Text>
            <View
              lightColor="#f6f7fb"
              style={[
                {
                  flexDirection: "row",
                  margin: verticalScale(8),
                  borderRadius: 10,
                  borderWidth: 0.4,
                  borderColor: "#0001",
                },
                // shadow(1),
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  magicModal.show(() => <ResponseModal />);
                }}
                style={{
                  flex: 2.5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome
                  name="money"
                  size={25}
                  color={Colors[colorSheme ?? "light"].text}
                />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 10,
                  paddingHorizontal: horizontalScale(5),
                  paddingVertical: verticalScale(8),
                  fontSize: moderateScale(20),
                  fontWeight: "500",
                }}
              >
                {amountReceived}{" "}
                <Text
                  style={{
                    fontSize: moderateScale(20),
                    paddingLeft: horizontalScale(10),
                  }}
                >
                  {getSymbolFromCurrency(currencyReceiver)}
                </Text>
              </Text>
            </View>
          </View>
        )}
        <View lightColor="#f6f7fb">
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Montant envoyer
          </Text>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
            ]}
          >
            <TouchableOpacity
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="wallet"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            <TextInput
              // maxLength={10}
              value={amount}
              onChangeText={handleChangeText}
              placeholderTextColor={Colors[colorSheme ?? "light"].text}
              keyboardType="numeric"
              placeholder="0"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(20),
                fontWeight: "500",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ChangeCurrentcurency />);
              }}
              style={{
                // flex: 2.5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <Text
                lightColor="#b2c5ca"
                style={{
                  fontSize: moderateScale(22),
                  // borderLeftColor: "#b2c5ca",
                  // borderLeftWidth: 1,
                  paddingLeft: horizontalScale(10),
                }}
              >
                {getSymbolFromCurrency(currentCurrency)}
              </Text>
              <Entypo name="chevron-down" size={25} color={"#b2c5ca"} />
            </TouchableOpacity>
          </View>
          {+amount < 1 ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              Amount invalid
            </Text>
          ) : (
            <Text />
          )}
        </View>
        <View lightColor="#f6f7fb">
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(17), fontWeight: "500" }}
          >
            Mode d'envoie
          </Text>

          <TouchableOpacity
            onPress={() => {
              magicModal.show(() => <ServiceSenderModal />);
            }}
            style={[
              {
                //   flex: 3,
                // justifyContent: "center",
                // alignItems: "center",
                // paddingHorizontal: horizontalScale(0),
                borderRadius: 10,
                margin: verticalScale(8),
                flexDirection: "row",
                justifyContent: "center",
                paddingVertical: verticalScale(10),
                // paddingHorizontal: horizontalScale(5),
                backgroundColor: "white",
              },
              shadow(1),
            ]}
          >
            <Entypo
              name="chevron-down"
              size={30}
              color={"#b2c5ca"}
              style={{
                position: "absolute",
                left: horizontalScale(10),
                bottom: verticalScale(5),
              }}
            />
            <Text
              lightColor="#b2c5ca"
              style={{
                fontSize: moderateScale(18),
                // paddingHorizontal: horizontalScale(10),
                textAlign: "center",
                // backgroundColor: "red",
              }}
            >
              {agenceSender?.name}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={verifyAndNext}
          style={[
            {
              width: "40%",
              alignSelf: "flex-start",
              backgroundColor: Colors[colorSheme ?? "light"].text,
              marginTop: verticalScale(30),
              paddingVertical: verticalScale(15),
              borderRadius: moderateScale(10),
            },
            shadow(10),
          ]}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors[colorSheme ?? "dark"].textOverlay,
              fontSize: moderateScale(20),
              textTransform: "uppercase",
            }}
          >
            next
          </Text>
        </TouchableOpacity>

        <MagicModalPortal />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Contact;
