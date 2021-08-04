# Quest Master

- Quests give XP
- XP give Lvl
- Lvl unlock new unique quests
- Standard Quests can be repeated multiple times and give multiple times xp (xp is capped at a certain amount)
- Deadline for gaining xp
- standard quests on off toggle

## PG Dump / Restore

```
29  wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
30  echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
31  apt update
32  apt install postgresql-client-13
33  pg_dump --version
34  pg_dump -h ec2-54-155-87-214.eu-west-1.compute.amazonaws.com -p 5432 -U gsvvsuifxhfcxe -d d5dil9jvic9gqq -v -f ./1-dump.sql
36  psql -h captain.app.questmaster.club -p 26543 -U david -d questmaster < ./1-dump.sql
```
