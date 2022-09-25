import * as core from '@actions/core';
import { comment } from './commenter/commenter';


async function run() {
  try {
    // Read inputs
    const message = core.getInput('message', { required: true })
    const updateExisting = core.getInput('updateExisting') === 'true'
    const token = core.getInput('token')

    // Get to business
    await comment(token, updateExisting, message);
  } catch (error) {
    const message = (error as any).message;
    core.setFailed(message);
  }
}

run();
