import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { CloudUpload, Close, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const ComplaintForm = ({ onSubmit, onCancel }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

hema = Yup.object({
    category: Yup.string().required('Category is required'),
    priority: Yup.string().required('Priori is required'),
    title: Yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(20, 'Description must be at least 20 characters')
      .max(500, 'Description must not exceed 500 characters'),
  });

  const formik = useFormik({
    initialValues: {
      category: '',
      priority: 'medium',
      title: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setUploading(true);
      try {
        await onSubmit({ ...values, images });
        toast.success('Complaint submitted successfully!');
        formik.resetForm();
        setImages([]);
      } catch (error) {
        toast.error('Failed to submit complaint');
      } finally {
        setUploading(false);
      }
    },
  });

  const handleImageUpload = (event) => {
    const files =rget.files);
    if (images.length + file> 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const categories = [
    { value: 'food', label: 'Food Quality' },
    { value: 'room', label: 'Room Issues' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' },
  ];

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
3,
            borderRadius: 2,
            mx: -2,
            mt: -2,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Submit a Complaint
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            We'll address your concern as soon as possible
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Priority
              </Typography>
              <RadioGroup
                row
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
              >
                {priorities.map((priority) => (
                  <FormControlLabel
                    key={priority.value}
                    value={priority.value}
                    control={<Radio sx={{ color: priority.color }} />}
                    label={
                      <Chip
                        label={priority.label}
                        size="small"
                        sx={{
                          backgroundColor: `${priority.color}20`,
                          color: priority.color,
                          fontWeight: 600,
                        }}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                placeholder="Brief description of the issue"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Brors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                placeholder="Provide detailed information..."
                value={formik.values.description}
                onChange={formik.handleChange}
                error={fok.touched.description && Boolean(formik.errors.description)}
                helperText={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : `${formik.values.description.length}/500 characters`
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Attach Images (Optional, Max 5)
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => document.getElementById('image-upload').click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Click to upload or drag and drop
                </Typography>
              </Box>

              {images.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'error.main',
                          color: 'white',
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel} disabled={uploading}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={uploading}
                  startIcon={<CheckCircle />}
                >
                  {uploading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
