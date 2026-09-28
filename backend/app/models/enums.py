from enum import Enum


class PlanTier(str, Enum):
  FREE = "free"
  STARTER = "starter"
  PRO = "pro"
  ENTERPRISE = "enterprise"


class SubscriptionStatus(str, Enum):
  TRIALING = "trialing"
  ACTIVE = "active"
  PAST_DUE = "past_due"
  CANCELED = "canceled"
  UNPAID = "unpaid"


class UserRole(str, Enum):
  OWNER = "owner"
  ADMIN = "admin"
  MEMBER = "member"
  VIEWER = "viewer"


class InvitationStatus(str, Enum):
  PENDING = "pending"
  ACCEPTED = "accepted"
  REVOKED = "revoked"
  EXPIRED = "expired"
