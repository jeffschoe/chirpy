# Development Notes

## PostgreSQL

### Connect to default postgres database

Connect to database (Linux SNAP):
```bash
postgresql.psql -U postgres
```

Connect to database (Linux APT):
```bash
sudo -u postgres psql
```

Connect to database (Mac):
```bash
psql postgres
```

### Connect to chirpy database

Connect to database (Linux SNAP):
```bash
postgresql.psql -U postgres -d chirpy
```

Connect to database (Linux APT):
```bash
sudo -u postgres psql -d chirpy
```

Connect to database (Mac):
```bash
psql chirpy
```