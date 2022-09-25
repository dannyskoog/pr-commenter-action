const github = require('@actions/github')

const COMMENT_MARKER = '<!-- PR_COMMENTER -->'

const createComment = async(octokit, owner, repo, issueNumber, body) => {
    return await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
    })
}

const updateComment = async(octokit, owner, repo, issueNumber, body) => {
    return await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
    })
}

const listComments = async(octokit, owner, repo, issueNumber) => {
    return await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
    });
}

const findCommentBySubstring = (comments, str) => {
    return comments.find(comment => comment.body.contains(str));
}

const comment = async(token, updateExisting, body) => {
    const octokit = github.getOctokit(token);
    const { repo: { repo, owner }, issue: { number: issueNumber } } = github.context;

    if (updateExisting) {
        const comments = listComments(octokit, owner, repo, issueNumber);
        const comment = findCommentBySubstring(comments, COMMENT_MARKER)

        if (comment) {
            await updateComment(octokit, owner, repo, issueNumber, body)
            return
        }
    }

    createComment(octokit, owner, repo, issueNumber, body)
}

module.exports = {
    comment
}