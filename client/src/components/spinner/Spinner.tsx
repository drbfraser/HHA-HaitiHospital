interface SpinnerProps {
  text?: string;
  size?: string;
  style?: object;
}

export function Spinner(props: SpinnerProps) {
  return (
    <div className="text-center text-primary" style={props.style ?? {}}>
      <div
        className="spinner-border"
        style={{ width: props.size ?? '', height: props.size ?? '' }}
      />
      <div className="font-weight-bold mt-3 text-secondary">{props.text ?? 'Loading...'}</div>
    </div>
  );
}
