package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Task.
 */
@Entity
@Table(name = "task")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start")
    private Instant start;

    @Column(name = "creation")
    private Instant creation;

    @Column(name = "title")
    private String title;

    @Column(name = "subject")
    private String subject;

    @Column(name = "study_length")
    private Integer studyLength;

    @Column(name = "break_length")
    private Integer breakLength;

    @Column(name = "completed")
    private Boolean completed;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "friends", "studySession", "leagues" }, allowSetters = true)
    private UserExtended createdBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Task id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStart() {
        return this.start;
    }

    public Task start(Instant start) {
        this.setStart(start);
        return this;
    }

    public void setStart(Instant start) {
        this.start = start;
    }

    public Instant getCreation() {
        return this.creation;
    }

    public Task creation(Instant creation) {
        this.setCreation(creation);
        return this;
    }

    public void setCreation(Instant creation) {
        this.creation = creation;
    }

    public String getTitle() {
        return this.title;
    }

    public Task title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubject() {
        return this.subject;
    }

    public Task subject(String subject) {
        this.setSubject(subject);
        return this;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getStudyLength() {
        return this.studyLength;
    }

    public Task studyLength(Integer studyLength) {
        this.setStudyLength(studyLength);
        return this;
    }

    public void setStudyLength(Integer studyLength) {
        this.studyLength = studyLength;
    }

    public Integer getBreakLength() {
        return this.breakLength;
    }

    public Task breakLength(Integer breakLength) {
        this.setBreakLength(breakLength);
        return this;
    }

    public void setBreakLength(Integer breakLength) {
        this.breakLength = breakLength;
    }

    public Boolean getCompleted() {
        return this.completed;
    }

    public Task completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public UserExtended getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(UserExtended userExtended) {
        this.createdBy = userExtended;
    }

    public Task createdBy(UserExtended userExtended) {
        this.setCreatedBy(userExtended);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Task)) {
            return false;
        }
        return id != null && id.equals(((Task) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Task{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            ", creation='" + getCreation() + "'" +
            ", title='" + getTitle() + "'" +
            ", subject='" + getSubject() + "'" +
            ", studyLength=" + getStudyLength() +
            ", breakLength=" + getBreakLength() +
            ", completed='" + getCompleted() + "'" +
            "}";
    }
}
