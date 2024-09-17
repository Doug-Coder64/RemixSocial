interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
}

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => {},
}: FormFieldProps) {
  return (
    <>
      <label
        htmlFor={htmlFor}
        className='text-gray-800 dark:text-gray-100 font-semibold'
      >
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className='w-full p-2 rounded-xl my-2 dark:bg-gray-800'
        value={value}
      />
    </>
  );
}
