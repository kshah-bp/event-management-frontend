const Input = ({...props}) => {
  return (
    <input
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}
export {Input}