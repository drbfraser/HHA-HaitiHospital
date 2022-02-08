import './loader_styles.css';

interface LoaderProps {}

const Loader = (props: LoaderProps) => {
  return (
    <div className={"loader-container loader"}>
      <h3 className="loader-content">Loading..</h3>
    </div>
  );
};

export default Loader;
