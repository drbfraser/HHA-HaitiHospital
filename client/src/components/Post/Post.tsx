import * as React from "react";
import { RouteComponentProps } from "react-router";

import IProps from 'components/IProps/IProps';

import './styles.css';

interface IPost extends IProps {
};

interface IPost extends RouteComponentProps {
  id: string;
};

export default {};

// Comment out during merging with boilerplate, need fix on argument type

// const Post = ({ match } : IPost) => {
//     // React.useEffect(() => {
//     //   fetch(`api.example.com/posts/${match.params.id}`)
//     // }, [match.params.id])
//     return <div>rendering post {match.params.id}</div>;
// };

// export default Post;
