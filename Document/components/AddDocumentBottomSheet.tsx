import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/contexts/AuthProvider";

type AddDocumentBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AddDocumentBottomSheet: React.FC<AddDocumentBottomSheetProps> = ({
  isVisible,
  onClose,
}) => {
  const snapPoints = useMemo(() => ["80"], []);
  const { t } = useTranslation();

  const { userInfo } = useAuth();

  return <div>AddDocumentBottomSheet</div>;
};

export default AddDocumentBottomSheet;
