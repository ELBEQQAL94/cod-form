// Libraries
import { Icon } from "@shopify/polaris";
import {
  LocationMajor,
  CustomersMajor,
  PhoneMajor,
  PinMajor,
  NoteMajor,
  EmailMajor,
} from "@shopify/polaris-icons";

// Labels
import { labels } from "../constants/labels";

const FieldIcon = ({ label }) => {
  switch (label) {
    case labels.FIRST_NAME_LABEL:
    case labels.LAST_NAME_LABEL:
      return (
        <div className="icon">
          <Icon source={CustomersMajor} color="base" />
        </div>
      );

    case labels.ADDRESS_1_LABEL:
    case labels.ADDRESS_2_LABEL:
    case labels.CITY_LABEL:
    case labels.COUNTRY_LABEL:
    case labels.PROVINCE_LABEL:
      return (
        <div className="icon">
          <Icon source={LocationMajor} color="base" />
        </div>
      );

    case labels.PHONE_LABEL:
    case labels.CONFIRM_PHONE_LABEL:
      return (
        <div className="icon">
          <Icon source={PhoneMajor} color="base" />
        </div>
      );

    case labels.ZIP_CODE_LABEL:
      return (
        <div className="icon">
          <Icon source={PinMajor} color="base" />
        </div>
      );

    case labels.NOTE_LABEL:
      return (
        <div className="icon">
          <Icon source={NoteMajor} color="base" />
        </div>
      );

    case labels.EMAIL_LABEL:
      return (
        <div className="icon">
          <Icon source={EmailMajor} color="base" />
        </div>
      );

    default:
      return (
        <div className="icon">
          <Icon source={CustomersMajor} color="base" />
        </div>
      );
  }
};

export default FieldIcon;
