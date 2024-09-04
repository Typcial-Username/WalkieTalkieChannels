// A Basic express API server

import express from 'express';
import bodyParser from 'body-parser';
import { Colors } from './Utils';
import { client } from '.'
import { CategoryChannel, ChannelType, PermissionsBitField, type GuildChannel, type VoiceChannel } from 'discord.js';

const app = express();

app.use(bodyParser.json());


app.post('/api', (req: express.Request, res: express.Response) => {
  console.log(req.body);
  res.send(req.body);

});

// Move a user to a voice channel
app.post('/api/moveUser', async (req: express.Request, res: express.Response) => {
  const { user, channel, guildId } = req.body;
  console.log({ user, channel, guildId });

  // Get the guild, member and voice channel
  const guild = client.guilds.cache.get(guildId);
  const member = await guild?.members.fetch(user);
  const voiceChannel = guild?.channels.cache.get(channel) as GuildChannel;

  // Check if the bot has permission to move members
  if (!guild?.members.cache.get(client.user?.id as string)?.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
    return res.status(500).json({ error: 'Bot does not have permission to move members' });
  }

  // Check if the member and voice channel exist
  if (!member || !voiceChannel) {
    return res.status(400).send('User or channel not found');
  }

  // Move the member to the voice channel
  member.voice.setChannel(voiceChannel as VoiceChannel);

  res.status(200);
});

// Mute a user
app.post('/api/muteUser', async (req: express.Request, res: express.Response) => {
  const { user, guildId } = req.body;

  // Get the guild and member
  const guild = client.guilds.cache.get(guildId);
  const member = await guild?.members.fetch(user);

  // Check if the bot has permission to mute members
  if (!guild?.members.cache.get(client.user?.id as string)?.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
    return res.status(500).json({ error: 'Bot does not have permission to mute members' });
  }

  // Check if the member exists
  if (!member) {
    return res.status(400).send('User not found');
  }

  // Mute the member
  member.voice.setMute(true);

  res.status(200);
});

// Unmute a user
app.post('/api/unmuteUser', (req: express.Request, res: express.Response) => {
  const { user, guildId } = req.body;

  // Get the guild and member
  const guild = client.guilds.cache.get(guildId);
  const member = guild?.members.cache.get(user);

  // Check if the bot has permission to mute members
  if (!guild?.members.cache.get(client.user?.id as string)?.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
    return res.status(500).json({ error: 'Bot does not have permission to mute members' });
  }

  // Check if the member exists
  if (!member) {
    return res.status(400).send('User not found');
  }

  // Unmute the member
  member.voice.setMute(false);

  res.status(200);
});

// Create a voice channel
app.post('/api/addChannel', (req: express.Request, res: express.Response) => {
  const { name, guildId, categoryId } = req.body;

  // Get the guild and category
  const guild = client.guilds.cache.get(guildId);
  const category = guild?.channels.cache.get(categoryId) as CategoryChannel;

  // Check if the category exists
  if (!category) {
    return res.status(400).send('Category not found');
  }

  // Check if the bot has permission to manage channels
  if (!guild?.members.cache.get(client.user?.id as string)?.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return res.status(500).json({ error: 'Bot does not have permission to manage channels' });
  }

  // Create the voice channel
  guild?.channels.create({ name, type: ChannelType.GuildVoice, parent: category });

  res.status(200);
});

app.listen(3000, () => {
  console.log(`${Colors.Fg.Green}Server is running on port 3000${Colors.Reset}`);
});