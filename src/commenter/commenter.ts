import * as github from '@actions/github';
import * as core from '@actions/core';
import { GitHub } from '@actions/github/lib/utils';
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";

const COMMENT_MARKER = '<!-- PR_COMMENTER -->';

const createComment = async(octokit: InstanceType<typeof GitHub>, owner: string, repo: string, issueNumber: number, body: string, marker?: string) => {
    if (marker) {
        body = `${body}\n\n${marker}`
    }

    return await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
    })
}

const updateComment = async(octokit: InstanceType<typeof GitHub>, owner: string, repo: string, commentId: number, body: string, marker: string) => {
    body = `${body}\n\n${marker}`

    return await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: commentId,
        body
    })
}

const listComments = async(octokit: InstanceType<typeof GitHub>, owner: string, repo: string, issueNumber: number) => {
    const { data: comments } = await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
    });

    return comments
}

const findCommentBySubstring = (comments: GetResponseDataTypeFromEndpointMethod<InstanceType<typeof GitHub>['rest']['issues']['listComments']>, str: string) => {
    return comments.find(comment => comment.body?.includes(str));
}

export const comment = async(token: string, updateExisting: boolean, body: string) => {
    const octokit = github.getOctokit(token);
    const { repo: { repo, owner }, issue: { number: issueNumber } } = github.context;

    core.info('updateExisting ' + updateExisting);

    if (updateExisting) {
        const comments = await listComments(octokit, owner, repo, issueNumber);
        core.info(JSON.stringify(comments));
        const comment = findCommentBySubstring(comments, COMMENT_MARKER)

        if (comment) {
            await updateComment(octokit, owner, repo, comment.id, body, COMMENT_MARKER)
        } else {
            await createComment(octokit, owner, repo, issueNumber, body, COMMENT_MARKER)
        }
    } else {
        await createComment(octokit, owner, repo, issueNumber, body)
    }
}
