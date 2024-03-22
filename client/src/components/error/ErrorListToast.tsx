export const ErrorListToast = (msg: string, errors: any) => {
  return (
    <div>
      <h3>{msg}</h3>
      <ul style={{ listStyleType: 'disc' }}>
        {errors.map((error: any, index: number) => (
          <li key={index}>
            <strong>{error.param} : </strong>"{error.msg}"
          </li>
        ))}
      </ul>
    </div>
  );
};
