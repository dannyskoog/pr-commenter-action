const core = require('@actions/core');
const commenter = require('./src/commenter/commenter');


async function run() {
  try {
    core.info('Starting action');

    // Parse inputs
    const messageInput = core.getInput('message', { required: true })
    core.info('updateExistingInput ' + core.getInput('updateExisting'));
    const updateExistingInput = core.getInput('updateExisting') === 'true'
    const tokenInput = core.getInput('token')

    await commenter.comment(tokenInput, updateExistingInput, messageInput);

    core.info('Finishing action');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
