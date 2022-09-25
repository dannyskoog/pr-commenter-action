import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import { createIssueComment, listIssueComments, updateIssueComment } from '../github-client/github-client';

const COMMENT_MARKER = '<!-- PR_COMMENTER -->';

export const comment = async(token: string, updateExisting: boolean, body: string) => {
    const octokit = github.getOctokit(token);
    const { repo: { repo, owner }, issue: { number: issueNumber } } = github.context;

    if (updateExisting) {
        const comments = await listIssueComments(octokit, owner, repo, issueNumber);
        const comment = findCommentBySubstring(comments, COMMENT_MARKER);

        if (comment) {
            await updateIssueComment(octokit, owner, repo, comment.id, commentBodyWithMarker(body));
        } else {
            await createIssueComment(octokit, owner, repo, issueNumber, commentBodyWithMarker(body));
        }
    } else {
        await createIssueComment(octokit, owner, repo, issueNumber, body);
    }
};

const findCommentBySubstring = (comments: GetResponseDataTypeFromEndpointMethod<InstanceType<typeof GitHub>['rest']['issues']['listComments']>, str: string) => {
    return comments.find(comment => comment.body?.includes(str));
};

const commentBodyWithMarker = (body: string) => {
    return `${body}\n\n${COMMENT_MARKER}`;
};
