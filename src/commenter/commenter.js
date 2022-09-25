const github = require('@actions/github')
const core = require('@actions/core');

const COMMENT_MARKER = '<!-- PR_COMMENTER -->'

const createComment = async(octokit, owner, repo, issueNumber, body, marker) => {
    if (marker) {
        body = `${body}\n${marker}`
    }

    return await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
    })
}

const updateComment = async(octokit, owner, repo, commentId, body) => {
    return await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: commentId,
        body
    })
}

const listComments = async(octokit, owner, repo, issueNumber) => {
    const { data: comments } = await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
    });

    return comments
}

const findCommentBySubstring = (comments, str) => {
    return comments.find(comment => {
        core.info('body ' + comment.body);
        return comment.body.includes(str)
    });
}

const comment = async(token, updateExisting, body) => {
    const octokit = github.getOctokit(token);
    const { repo: { repo, owner }, issue: { number: issueNumber } } = github.context;

    core.info('updateExisting ' + updateExisting);

    if (updateExisting) {
        const comments = await listComments(octokit, owner, repo, issueNumber);
        core.info(JSON.stringify(comments));
        const comment = findCommentBySubstring(comments, COMMENT_MARKER)

        if (comment) {
            await updateComment(octokit, owner, repo, comment.id, body)
        } else {
            await createComment(octokit, owner, repo, issueNumber, body, COMMENT_MARKER)
        }
    } else {
        await createComment(octokit, owner, repo, issueNumber, body)
    }
}

module.exports = {
    comment
}