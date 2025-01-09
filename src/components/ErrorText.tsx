interface Props {
    message?: string
}

export const ErrorText = ({ message }: Props) => {
    return <p className="text-red-500 text-sm mt-1">{message}</p>
};