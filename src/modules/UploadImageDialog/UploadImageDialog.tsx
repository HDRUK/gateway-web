import Button from "@/components/Button";
import { Box, TextField, Typography } from "@mui/material";
import MuiDialogContent from "@mui/material/DialogContent";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import useDialog from "@/hooks/useDialog";
import { useTranslations } from "next-intl";

const TRANSLATION_PATH = `pages.account.team.collections.create`;


const UploadImageDialog = ({ setIsInvalidImage }) => {
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    return (
    <>
        <Dialog title={t("addImageFailTitle")} titleSx={{ textAlign: "center", mt: 2 }}>
            <MuiDialogContent
                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", color: "red"}}>
                 <Typography>
                    {t("addImageFailInfo")}
                 </Typography>
                 <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Button 
                        sx={{ display: "flex", m: 2, p: 1, width: "25%"}} 
                        color= "secondary"
                        variant= "outlined"
                        onClick={() => {
                            setIsInvalidImage(false);
                            hideDialog();
                            }}>
                        {t("addImageFailButtonNewImage")}
                        </Button>
                        <Button 
                        sx={{ display: "flex", m: 2, p: 0, width: "30%" }} 
                        color="secondary"
                        variant= "outlined"
                        onClick={() => {
                            setIsInvalidImage(false);
                            hideDialog(); 
                            }}>
                        {t("addImageFailButtonContinue")}
                    </Button>
                </Box>
            </MuiDialogContent>
        </Dialog>
    </>
    );
  }

  export default UploadImageDialog;
