package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Friend.
 */
@Entity
@Table(name = "friend")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Friend implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "friends", "studySession", "leagues" }, allowSetters = true)
    private UserExtended friendshipFrom;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "friends", "studySession", "leagues" }, allowSetters = true)
    private UserExtended friendshipTo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Friend id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserExtended getFriendshipFrom() {
        return this.friendshipFrom;
    }

    public void setFriendshipFrom(UserExtended userExtended) {
        this.friendshipFrom = userExtended;
    }

    public Friend friendshipFrom(UserExtended userExtended) {
        this.setFriendshipFrom(userExtended);
        return this;
    }

    public UserExtended getFriendshipTo() {
        return this.friendshipTo;
    }

    public void setFriendshipTo(UserExtended userExtended) {
        this.friendshipTo = userExtended;
    }

    public Friend friendshipTo(UserExtended userExtended) {
        this.setFriendshipTo(userExtended);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Friend)) {
            return false;
        }
        return id != null && id.equals(((Friend) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Friend{" +
            "id=" + getId() +
            "}";
    }
}
