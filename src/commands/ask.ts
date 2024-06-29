import { Command } from 'commander';
import fs from 'fs/promises';
import { ProviderFactory } from '../providers/provider_factory';
import { getProviderConfig } from '../config/provider_config';
import { logger } from '../utils/logger';
import { Spinner } from '../utils/spinner';
import { maxTokensOption, temperatureOption, topPOption, topKOption, systemOption, fileOption, outputOption, formatOption } from '../options';
import { formatOutput, writeOutput } from '../helpers/output_helper';
import { Message } from '../providers/types';

export function createAskCommand(): Command {
  const askCommand = new Command('ask')
    .description('Ask a question to the LLM')
    .option('--provider <provider>', 'LLM provider to use')
    .addOption(maxTokensOption)
    .addOption(temperatureOption)
    .addOption(topPOption)
    .addOption(topKOption)
    .addOption(systemOption)
    .addOption(fileOption)
    .addOption(outputOption)
    .addOption(formatOption)
    .action(async (options, command) => {
      try {
        const globalOptions = command.parent.opts();
        const providerConfig = getProviderConfig(options.provider || globalOptions.provider);
        providerConfig.model = globalOptions.resolvedModel;
        const provider = await ProviderFactory.createProvider(providerConfig);

        let input: string;
        if (options.file) {
          input = await fs.readFile(options.file, 'utf-8');
        } else {
          input = command.args.join(' ');
          if (!input) {
            logger.error('No question provided. Please provide a question or use the --file option.');
            return;
          }
        }

        const messages: Message[] = [{ role: 'user', content: input }];

        logger.info(`🤖 Using provider: ${providerConfig.type}`);
        logger.info(`🤖 Using model: ${providerConfig.model}`);

        const spinner = new Spinner('Generating response...');
        spinner.start();

        const response = await provider.generateMessage(messages, {
          maxTokens: options.maxTokens,
          temperature: options.temperature,
          topP: options.topP,
          topK: options.topK,
          system: options.system,
        });

        spinner.succeed('Response generated');

        const output = formatOutput({ content: [{ text: response }] }, options.format);
        await writeOutput(output, options.output);

      } catch (error) {
        logger.error(`An error occurred: ${error}`);
      }
    });

  return askCommand;
}
