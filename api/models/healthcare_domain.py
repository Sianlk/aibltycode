"""Healthcare domain models: patients, appointments, medical records."""
from sqlalchemy import String, Text, Date, DateTime, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from api.core.db import Base
from datetime import datetime, timezone, date
import uuid, enum

class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class Patient(Base):
    __tablename__ = "patients"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=True)
    blood_type: Mapped[str] = mapped_column(String(5), nullable=True)
    allergies: Mapped[list] = mapped_column(JSONB, default=[])
    medications: Mapped[list] = mapped_column(JSONB, default=[])
    emergency_contact: Mapped[dict] = mapped_column(JSONB, default={})
    insurance_info: Mapped[dict] = mapped_column(JSONB, default={})
    medical_history: Mapped[dict] = mapped_column(JSONB, default={})
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Provider(Base):
    __tablename__ = "providers"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    specialty: Mapped[str] = mapped_column(String(200))
    license_number: Mapped[str] = mapped_column(String(100), unique=True)
    npi_number: Mapped[str] = mapped_column(String(20), unique=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    consultation_fee: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    languages: Mapped[list] = mapped_column(JSONB, default=["en"])
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="provider")

class Appointment(Base):
    __tablename__ = "appointments"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), index=True)
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="CASCADE"), index=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    duration_minutes: Mapped[int] = mapped_column(default=30)
    status: Mapped[AppointmentStatus] = mapped_column(default=AppointmentStatus.SCHEDULED)
    appointment_type: Mapped[str] = mapped_column(String(50), default="video")  # video, in_person, phone
    symptoms: Mapped[str] = mapped_column(Text, nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    prescription: Mapped[dict] = mapped_column(JSONB, default={})
    video_room_url: Mapped[str] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    provider: Mapped["Provider"] = relationship("Provider", back_populates="appointments")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), index=True)
    appointment_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    record_type: Mapped[str] = mapped_column(String(50))  # lab, imaging, prescription, visit_note
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[dict] = mapped_column(JSONB, default={})
    file_url: Mapped[str] = mapped_column(String(1000), nullable=True)
    is_encrypted: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("providers.id"), nullable=True)
