import React from "react";
import { RouteComponentProps } from "react-router";

import { ElementStyleProps } from 'constants/interfaces';

import './styles.css';

interface PostProps extends ElementStyleProps {
};

interface PostProps extends RouteComponentProps {
  id: string;
};

const Post = (props: PostProps) => {

};

export default Post;

// Comment out during merging with boilerplate, need fix on argument type

// const Post = ({ match } : IPost) => {
//     // React.useEffect(() => {
//     //   fetch(`api.example.com/posts/${match.params.id}`)
//     // }, [match.params.id])
//     return <div>rendering post {match.params.id}</div>;
// };

// export default Post;
