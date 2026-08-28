import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { GenericError } from "./Error";

export default function ErrorElement() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <GenericError
        title={`Ooops! ${error.status}`}
        message={
          "error" in error &&
          typeof error.error === "object" &&
          error.error &&
          "message" in error.error &&
          typeof error.error.message === "string" &&
          error.error.message ? (
            <p>{error.error.message}</p>
          ) : (
            <p>Something happened!</p>
          )
        }
      />
    );
  }

  return (
    <GenericError
      title="Unexpected Error!"
      message={<p>{(error as Error)?.message}</p>}
    />
  );
}
