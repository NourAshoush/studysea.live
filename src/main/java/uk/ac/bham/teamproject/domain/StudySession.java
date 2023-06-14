package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudySession.
 */
@Entity
@Table(name = "study_session")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudySession implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "actual_start")
    private Instant actualStart;

    @Column(name = "is_private")
    private Boolean isPrivate;

    @JsonIgnoreProperties(value = { "createdBy" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Task task;

    @JsonIgnoreProperties(value = { "user", "friends", "studySession", "leagues" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserExtended owner;

    @OneToMany(mappedBy = "studySession")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "friends", "studySession", "leagues" }, allowSetters = true)
    private Set<UserExtended> members = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudySession id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getActualStart() {
        return this.actualStart;
    }

    public StudySession actualStart(Instant actualStart) {
        this.setActualStart(actualStart);
        return this;
    }

    public void setActualStart(Instant actualStart) {
        this.actualStart = actualStart;
    }

    public Boolean getIsPrivate() {
        return this.isPrivate;
    }

    public StudySession isPrivate(Boolean isPrivate) {
        this.setIsPrivate(isPrivate);
        return this;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public Task getTask() {
        return this.task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public StudySession task(Task task) {
        this.setTask(task);
        return this;
    }

    public UserExtended getOwner() {
        return this.owner;
    }

    public void setOwner(UserExtended userExtended) {
        this.owner = userExtended;
    }

    public StudySession owner(UserExtended userExtended) {
        this.setOwner(userExtended);
        return this;
    }

    public Set<UserExtended> getMembers() {
        return this.members;
    }

    public void setMembers(Set<UserExtended> userExtendeds) {
        if (this.members != null) {
            this.members.forEach(i -> i.setStudySession(null));
        }
        if (userExtendeds != null) {
            userExtendeds.forEach(i -> i.setStudySession(this));
        }
        this.members = userExtendeds;
    }

    public StudySession members(Set<UserExtended> userExtendeds) {
        this.setMembers(userExtendeds);
        return this;
    }

    public StudySession addMembers(UserExtended userExtended) {
        this.members.add(userExtended);
        userExtended.setStudySession(this);
        return this;
    }

    public StudySession removeMembers(UserExtended userExtended) {
        this.members.remove(userExtended);
        userExtended.setStudySession(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudySession)) {
            return false;
        }
        return id != null && id.equals(((StudySession) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudySession{" +
            "id=" + getId() +
            ", actualStart='" + getActualStart() + "'" +
            ", isPrivate='" + getIsPrivate() + "'" +
            "}";
    }
}
