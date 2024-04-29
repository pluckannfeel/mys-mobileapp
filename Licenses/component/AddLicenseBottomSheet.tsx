import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/contexts/AuthProvider";

type AddLicenseBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AddLicenseBottomSheet: React.FC<AddLicenseBottomSheetProps> = ({
  isVisible,
  onClose,
}) => {
  const snapPoints = useMemo(() => ["80"], []);
  const { t } = useTranslation();

  const { userInfo } = useAuth();

  return <div>AddLicenseBottomSheet</div>;
};

export default AddLicenseBottomSheet;
