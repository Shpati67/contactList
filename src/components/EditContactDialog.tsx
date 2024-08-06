import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ContactType } from "./Contact";
import { contactApiSlice } from "../features/contactApiSlice";
import { Field, Form } from "react-final-form";
import { Box, Grid, Typography } from "@mui/material";
import { Picture } from "./AddContactDialog";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditContactDialogProps {
  open: boolean;
  onClose: () => void;
  contact: ContactType | null;
}

const EditContactDialog: React.FC<EditContactDialogProps> = ({
  open,
  onClose,
  contact,
}) => {
  const [updateContact] = contactApiSlice.useUpdateContactMutation();
  const [uploadImage] = contactApiSlice.useUploadImageWithIdMutation();
  const [photoPreview, setPhotoPreview] = useState<Picture | undefined>();
  const { id } = useParams() as any;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const image = {
        file: file,
        filePreview: URL.createObjectURL(file),
      };

      setPhotoPreview(image);
    }
  };

  const handleSave = async (values: ContactType) => {
    try {
      let updatedValues = { ...values };
      if (photoPreview) {
        const formData = new FormData();
        formData.append("file", photoPreview.file);
        formData.append("id", id);
        const image = await uploadImage(formData).unwrap();
        updatedValues.photoUrl = image.photoUrl;
      }
      await updateContact(updatedValues).unwrap();
      toast.success("Contact was edited successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update contact!");
      console.log("Failed to update contact: ", error);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>Edit Contact for {contact.name}</DialogTitle>
      <Form
        initialValues={contact}
        onSubmit={handleSave}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div className="mb-4">
                    <Field name="name">
                      {({ input }) => (
                        <TextField
                          {...input}
                          label="Name"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    </Field>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="mb-4">
                    <Field name="title">
                      {({ input }) => (
                        <TextField
                          {...input}
                          label="Title"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    </Field>
                  </div>
                </Grid>
              </Grid>
              <div className="mb-4">
                <Field name="email">
                  {({ input }) => (
                    <TextField
                      {...input}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  )}
                </Field>
              </div>
              <div className="mb-4">
                <Field name="address">
                  {({ input }) => (
                    <TextField
                      {...input}
                      label="Address"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  )}
                </Field>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div className="mb-4">
                    <Field name="phone">
                      {({ input }) => (
                        <TextField
                          {...input}
                          label="Phone"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    </Field>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="mb-4">
                    <Field name="status">
                      {({ input }) => (
                        <TextField
                          {...input}
                          label="Status"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    </Field>
                  </div>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Field name="photo">
                  {() => (
                    <div className="flex items-start ">
                      <Button
                        variant="contained"
                        size="medium"
                        className="h-10"
                        component="label"
                      >
                        Upload Photo
                        <input
                          type="file"
                          hidden
                          onChange={(event) => handleFileChange(event)}
                        />
                      </Button>
                      {(photoPreview || contact.photoUrl) && (
                        <Box ml={6}>
                          <Typography>Photo Preview:</Typography>
                          <img
                            src={photoPreview?.filePreview || contact.photoUrl}
                            alt="Photo Preview"
                            className="w-32 h-32 rounded-full"
                          />
                        </Box>
                      )}
                    </div>
                  )}
                </Field>
              </Box>
              <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  Save
                </Button>
              </DialogActions>
            </DialogContent>
          </form>
        )}
      />
    </Dialog>
  );
};

export default EditContactDialog;
