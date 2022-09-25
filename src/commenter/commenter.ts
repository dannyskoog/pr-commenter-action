import * as github from '@actions/github';
import { createIssueComment, IssueComment, listIssueComments, updateIssueComment } from '../api/api';

export const postComment = async (token: string, marker: string, message: string) => {
  const octokit = github.getOctokit(token);
  const { repo: { repo, owner }, issue: { number: issueNumber } } = github.context;

  if (marker) {
    const comments = await listIssueComments(octokit, owner, repo, issueNumber);
    const comment = findCommentBySubstring(comments, marker);

    if (comment) {
      await updateIssueComment(octokit, owner, repo, comment.id, messageWithMarker(message, marker));
    } else {
      await createIssueComment(octokit, owner, repo, issueNumber, messageWithMarker(message, marker));
    }
  } else {
    await createIssueComment(octokit, owner, repo, issueNumber, message);
  }
};

const findCommentBySubstring = (comments: IssueComment[], str: string) => {
  return comments.find(comment => comment.body?.includes(str));
};

const messageWithMarker = (message: string, marker: string) => {
  return `${message}\n\n${marker}`;
};
