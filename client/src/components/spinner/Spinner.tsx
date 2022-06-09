export function Spinner(props: { text?: string; size?: string; style?: object }) { return (
    <div className="text-center text-primary" style={props.style??{}}>
      <div
        className="spinner-border"
        style={{ width: props.size ?? '', height: props.size ?? '' }}
      />
      <div className="font-weight-bold mt-3 text-secondary">{props.text ?? 'Loading...'}</div>
    </div>
  );
}
