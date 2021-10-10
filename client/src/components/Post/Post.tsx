import * as React from "react";
import { RouteComponentProps } from "react-router";

import IProps from 'components/IProps/IProps';

import 'components/Post/styles.css';

interface IPost extends IProps {
};

interface IPost extends RouteComponentProps {
  id: string;
};

const Post: React.FC<IPost> = ({ match } : IPost) => {
    // React.useEffect(() => {
    //   fetch(`api.example.com/posts/${match.params.id}`)
    // }, [match.params.id])
    return <div>rendering post {match.params.id}</div>;
};

export default Post;
