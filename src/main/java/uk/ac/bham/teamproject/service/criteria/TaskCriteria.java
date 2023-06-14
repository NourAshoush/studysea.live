package uk.ac.bham.teamproject.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link uk.ac.bham.teamproject.domain.Task} entity. This class is used
 * in {@link uk.ac.bham.teamproject.web.rest.TaskResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /tasks?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TaskCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private InstantFilter start;

    private InstantFilter creation;

    private StringFilter title;

    private StringFilter subject;

    private IntegerFilter studyLength;

    private IntegerFilter breakLength;

    private BooleanFilter completed;

    private LongFilter createdById;

    private Boolean distinct;

    public TaskCriteria() {}

    public TaskCriteria(TaskCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.start = other.start == null ? null : other.start.copy();
        this.creation = other.creation == null ? null : other.creation.copy();
        this.title = other.title == null ? null : other.title.copy();
        this.subject = other.subject == null ? null : other.subject.copy();
        this.studyLength = other.studyLength == null ? null : other.studyLength.copy();
        this.breakLength = other.breakLength == null ? null : other.breakLength.copy();
        this.completed = other.completed == null ? null : other.completed.copy();
        this.createdById = other.createdById == null ? null : other.createdById.copy();
        this.distinct = other.distinct;
    }

    @Override
    public TaskCriteria copy() {
        return new TaskCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public InstantFilter getStart() {
        return start;
    }

    public InstantFilter start() {
        if (start == null) {
            start = new InstantFilter();
        }
        return start;
    }

    public void setStart(InstantFilter start) {
        this.start = start;
    }

    public InstantFilter getCreation() {
        return creation;
    }

    public InstantFilter creation() {
        if (creation == null) {
            creation = new InstantFilter();
        }
        return creation;
    }

    public void setCreation(InstantFilter creation) {
        this.creation = creation;
    }

    public StringFilter getTitle() {
        return title;
    }

    public StringFilter title() {
        if (title == null) {
            title = new StringFilter();
        }
        return title;
    }

    public void setTitle(StringFilter title) {
        this.title = title;
    }

    public StringFilter getSubject() {
        return subject;
    }

    public StringFilter subject() {
        if (subject == null) {
            subject = new StringFilter();
        }
        return subject;
    }

    public void setSubject(StringFilter subject) {
        this.subject = subject;
    }

    public IntegerFilter getStudyLength() {
        return studyLength;
    }

    public IntegerFilter studyLength() {
        if (studyLength == null) {
            studyLength = new IntegerFilter();
        }
        return studyLength;
    }

    public void setStudyLength(IntegerFilter studyLength) {
        this.studyLength = studyLength;
    }

    public IntegerFilter getBreakLength() {
        return breakLength;
    }

    public IntegerFilter breakLength() {
        if (breakLength == null) {
            breakLength = new IntegerFilter();
        }
        return breakLength;
    }

    public void setBreakLength(IntegerFilter breakLength) {
        this.breakLength = breakLength;
    }

    public BooleanFilter getCompleted() {
        return completed;
    }

    public BooleanFilter completed() {
        if (completed == null) {
            completed = new BooleanFilter();
        }
        return completed;
    }

    public void setCompleted(BooleanFilter completed) {
        this.completed = completed;
    }

    public LongFilter getCreatedById() {
        return createdById;
    }

    public LongFilter createdById() {
        if (createdById == null) {
            createdById = new LongFilter();
        }
        return createdById;
    }

    public void setCreatedById(LongFilter createdById) {
        this.createdById = createdById;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TaskCriteria that = (TaskCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(start, that.start) &&
            Objects.equals(creation, that.creation) &&
            Objects.equals(title, that.title) &&
            Objects.equals(subject, that.subject) &&
            Objects.equals(studyLength, that.studyLength) &&
            Objects.equals(breakLength, that.breakLength) &&
            Objects.equals(completed, that.completed) &&
            Objects.equals(createdById, that.createdById) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, start, creation, title, subject, studyLength, breakLength, completed, createdById, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TaskCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (start != null ? "start=" + start + ", " : "") +
            (creation != null ? "creation=" + creation + ", " : "") +
            (title != null ? "title=" + title + ", " : "") +
            (subject != null ? "subject=" + subject + ", " : "") +
            (studyLength != null ? "studyLength=" + studyLength + ", " : "") +
            (breakLength != null ? "breakLength=" + breakLength + ", " : "") +
            (completed != null ? "completed=" + completed + ", " : "") +
            (createdById != null ? "createdById=" + createdById + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
