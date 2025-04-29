const required = ["groupId", "code"];
const requiredSms = [];
const requiredEmail = ["domain"];
const requiredWhatsapp = [
  "metaBusinessId",
  "metaBusinessToken",
  "metaNumberId",
];

class CognitoUtil {
  static transform(properties) {
    Object.keys(properties).forEach((propertyKey) => {
      if (propertyKey.indexOf("custom:") > -1) {
        properties[propertyKey.replace("custom:", "")] =
          properties[propertyKey];
        delete properties[propertyKey];
      }
    });
    return properties;
  }

  static validate(properties) {
    required.forEach((field) => {
      if (Object.keys(properties).indexOf(field) == -1) {
        throw new Error(
          `Configuracion del usuario incomnpleta. Es necesario configurar la propiedad ${field}.`
        );
      }
    });
  }

  static validateEmail(properties) {
    requiredEmail.forEach((field) => {
      if (Object.keys(properties).indexOf(field) == -1) {
        throw new Error(
          `Configuracion del usuario incomnpleta para enviar correos. Es necesario configurar la propiedad ${field}.`
        );
      }
    });
  }

  static validateSms(properties) {
    requiredSms.forEach((field) => {
      if (Object.keys(properties).indexOf(field) == -1) {
        throw new Error(
          `Configuracion del usuario incomnpleta para enviar sms. Es necesario configurar la propiedad ${field}.`
        );
      }
    });
  }

  static validateWhatsapp(properties) {
    requiredWhatsapp.forEach((field) => {
      if (Object.keys(properties).indexOf(field) == -1) {
        throw new Error(
          `Configuracion del usuario incomnpleta para enviar whatsapps. Es necesario configurar la propiedad ${field}.`
        );
      }
    });
  }

  static validateDomain(domains, email) {
    return (
      domains
        .split(";")
        .map((domain) => {
          if (domain.indexOf("@") > -1 && domain == email) {
            return true;
          } else if (email.split("@")[1] == domain) {
            return true;
          } else {
            return false;
          }
        })
        .filter((valid) => valid).length > 0
    );
  }
}

module.exports = CognitoUtil;
