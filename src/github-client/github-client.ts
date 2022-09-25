import { GitHub } from '@actions/github/lib/utils';

export const createIssueComment = async(octokit: InstanceType<typeof GitHub>, owner: string, repo: string, issueNumber: number, body: string) => {
    return await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body,
    });
};

export const updateIssueComment = async(octokit: InstanceType<typeof GitHub>, owner: string, repo: string, commentId: number, body: string) => {
    return await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: commentId,
        body,
    });
};

export const listIssueComments = async(octokit: InstanceType<typeof GitHub>, owner: string, repo: string, issueNumber: number) => {
    const { data: comments } = await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
    });

    return comments;
};