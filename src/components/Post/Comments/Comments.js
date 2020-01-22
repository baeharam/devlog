// @flow strict
import React from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import { useSiteMetadata } from '../../../hooks';
import ReactUtterences from 'react-utterances';

type Props = {
  postTitle: string,
  postSlug: string
};

const Comments = ({ postTitle, postSlug }: Props) => {
  const { url, disqusShortname } = useSiteMetadata();

  const GITHUB_NAME = 'baeharam';
  const GITHUB_REPO = 'blog-comments';

  return (
    <ReactUtterences 
      repo={`${GITHUB_NAME}/${GITHUB_REPO}`}
      type='pathname'
    />
  );
};

export default Comments;
