import { FormGroup } from "@/components/auth/AuthCard";
import Button from "@/components/reusable/Button";
import { useCreateReviewMutation } from "@/hooks/movies/useCreateReviewMutation";
import { useTypedSelector } from "@/store/store";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(100%, 400px);
`;

const DropArea = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #444;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #33cc99;
    color: #33cc99;
    background-color: rgba(51, 204, 153, 0.05);
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 300px;
  background-color: #0a0a0a;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #333;
`;

const PreviewMedia = `
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
`;

const StyledImage = styled.img`
  ${PreviewMedia}
`;

const StyledVideo = styled.video`
  ${PreviewMedia}
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background-color: #ff4444;
    border-color: #ff4444;
  }
`;

export default function Review() {
  const { movieId } = useParams();

  const { id: userId } = useTypedSelector((store) => store.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileReview, setFileReview] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const { mutate, error } = useCreateReviewMutation();

  const {
    handleSubmit,
    formState: { errors, isValid },
    setError,
    register,
  } = useForm({
    defaultValues: {
      review: "",
      rating: 1,
    },
  });

  useEffect(() => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }, [error]);

  function onSumbit(data: { review: string; rating: number }) {
    let isError = false;

    function checkForError(
      condition: boolean,
      errorField: "review" | "rating",
      message: string,
    ) {
      if (condition) {
        setError(errorField, {
          message: message,
        });
        isError = true;
      }
    }

    checkForError(
      typeof data.rating !== "number",
      "rating",
      "should_be_number",
    );
    checkForError(
      data.rating < 1 || data.rating > 10,
      "rating",
      "invalid_rating",
    );
    checkForError(data.review.trim().length < 8, "review", "min_length");
    checkForError(data.review.trim().length > 1000, "review", "max_length");

    if (!isError) {
      mutate({
        rating: data.rating,
        review: data.review,
        userId: userId!,
        reviewFile: fileReview,
        movieExtId: movieId!,
      });
    }
  }

  function handleFileSelect(file: File | undefined | null) {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload .png, .jpg, .webp, .mp4 or .webm");
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    setFileReview(file);
    setObjectUrl(URL.createObjectURL(file));
  }

  function handleDeleteFile() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileReview(null);
  }

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  if (!movieId) {
    return <Navigate to={"/"} />;
  }

  return (
    <StyledWrapper>
      <StyledForm onSubmit={handleSubmit(onSumbit)}>
        <FormGroup>
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            placeholder="Review..."
            rows={9}
            {...register("review")}
          />
          {errors.review && <p>{errors.review.message}</p>}
        </FormGroup>
        <FormGroup>
          <label htmlFor="rating">Rating</label>
          <input
            id="rating"
            type="number"
            min={1}
            max={10}
            placeholder="Rating..."
            {...register("rating", { valueAsNumber: true })}
          />
          {errors.rating && <p>{errors.rating.message}</p>}
        </FormGroup>
        <FormGroup>
          <label htmlFor="file">Attach your review max 500MB</label>
          <input
            id="file"
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleFileSelect(file);
            }}
          />
          {!fileReview && (
            <DropArea
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                handleFileSelect(file);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              Drag your video
            </DropArea>
          )}
          {fileReview && objectUrl && (
            <PreviewContainer>
              <RemoveButton
                type="button"
                onClick={handleDeleteFile}
                aria-label="Remove file"
              >
                ✕
              </RemoveButton>

              {fileReview.type.startsWith("video") ? (
                <StyledVideo src={objectUrl} controls />
              ) : fileReview.type.startsWith("image") ? (
                <StyledImage src={objectUrl} alt="Review attachment preview" />
              ) : (
                <p style={{ color: "#fff" }}>Unknown Format!</p>
              )}
            </PreviewContainer>
          )}
        </FormGroup>
        <Button disabled={!isValid} variant="filled" type="submit">
          Submit Review
        </Button>
      </StyledForm>
    </StyledWrapper>
  );
}
