import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form } from "react-final-form";
import { contactApiSlice } from "../features/contactApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddContactDialogProps {
  open: boolean;
  handleClose: () => void;
}

export type Picture = {
  file: File;
  filePreview: string;
};

const AddContactDialog: React.FC<AddContactDialogProps> = ({
  open,
  handleClose,
}) => {
  const [photoPreview, setPhotoPreview] = useState<Picture | undefined>();
  const [saveContact] = contactApiSlice.useSaveContactMutation();
  const [uploadImage] = contactApiSlice.useUploadImageWithIdMutation();

  const handleSave = async (values: any) => {
    const formData = new FormData();
    try {
      const response = await saveContact(values).unwrap();
      if (photoPreview && response) {
        formData.append("file", photoPreview.file);
        formData.append("id", response.id);
        await uploadImage(formData);
      }
      toast.success("Contact was added successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to create contact!");
      console.log(error);
    }
  };

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

  useEffect(() => {
    if (!open) {
      setPhotoPreview(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Contact</DialogTitle>
      <Form
        onSubmit={handleSave}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field name="name">
                    {({ input }) => (
                      <TextField
                        {...input}
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        required
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field name="title">
                    {({ input }) => (
                      <TextField
                        {...input}
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        required
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
              <Field name="email">
                {({ input }) => (
                  <TextField
                    {...input}
                    margin="dense"
                    label="Email"
                    type="email"
                    required
                    fullWidth
                  />
                )}
              </Field>
              <Field name="address">
                {({ input }) => (
                  <TextField
                    {...input}
                    margin="dense"
                    label="Address"
                    type="text"
                    required
                    fullWidth
                  />
                )}
              </Field>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field name="phone">
                    {({ input }) => (
                      <TextField
                        {...input}
                        margin="dense"
                        label="Phone"
                        type="text"
                        required
                        fullWidth
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field name="status">
                    {({ input }) => (
                      <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select {...input}>
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Field name="photo">
                  {() => (
                    <>
                      <Button variant="contained" component="label">
                        Upload Photo
                        <input
                          type="file"
                          hidden
                          onChange={(event) => handleFileChange(event)}
                        />
                      </Button>
                      {photoPreview && (
                        <Box ml={2}>
                          <Typography>Photo Preview:</Typography>
                          <img
                            src={photoPreview.filePreview}
                            alt="Photo Preview"
                            className="w-32 h-32 rounded-full"
                          />
                        </Box>
                      )}
                    </>
                  )}
                </Field>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  form.reset();
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        )}
      />
    </Dialog>
  );
};

export default AddContactDialog;
