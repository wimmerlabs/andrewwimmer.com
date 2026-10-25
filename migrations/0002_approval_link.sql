-- A fresh private link is made when a request is approved and sent in the
-- approval email. Like the original link, only its SHA-256 hash is stored.

ALTER TABLE requests ADD COLUMN link_hash TEXT;
CREATE UNIQUE INDEX requests_link_hash ON requests (link_hash);
