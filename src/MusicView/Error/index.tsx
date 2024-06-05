import { useSelector } from "react-redux";

export default function Error() {
    const { error } = useSelector((state: any) => state.errorReducer);
    return (
        <div id="mv-error">
            <h1>Something went wrong...</h1>
            {process.env.NODE_ENV === "development" ? (
                <p>{JSON.stringify(error, null, 2)}</p>
            ) : null}

            {process.env.NODE_ENV === "production" ? (
                <p>{error ? error.message : null}</p>
            ) : null}
        </div>
    );
}
