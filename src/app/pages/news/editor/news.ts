/* eslint-disable import/no-named-as-default, @typescript-eslint/no-unused-vars */

import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import * as Apollo from 'apollo-angular';
import * as Types from '../../../../graphql/schema.d';

export type CreateNewsMutationVariables = Types.Exact<{
  title: Types.Scalars['String'];
  html: Types.Scalars['String'];
  markdown: Types.Scalars['String'];
  userId: Types.Scalars['ID'];
}>;

export type CreateNewsMutation = {
  __typename?: 'Mutation';
  createNews: { __typename?: 'News'; id: string };
};

export const CreateNewsDocument = gql`
  mutation createNews(
    $title: String!
    $html: String!
    $markdown: String!
    $userId: ID!
  ) {
    createNews(
      input: {
        title: $title
        html: $html
        markdown: $markdown
        userID: $userId
        tagIDs: []
      }
    ) {
      id
    }
  }
`;
