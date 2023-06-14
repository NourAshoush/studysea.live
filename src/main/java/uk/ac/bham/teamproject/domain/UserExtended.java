package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A UserExtended.
 */
@Entity
@Table(name = "user_extended")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserExtended implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "status")
    private String status;

    @Column(name = "institution")
    private String institution;

    @Column(name = "course")
    private String course;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description")
    private String description;

    @Column(name = "privacy")
    private Boolean privacy;

    @Column(name = "dark_mode")
    private Boolean darkMode;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "friendshipTo")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "friendshipFrom", "friendshipTo" }, allowSetters = true)
    private Set<Friend> friends = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "task", "owner", "members" }, allowSetters = true)
    private StudySession studySession;

    @ManyToMany(mappedBy = "members")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "members" }, allowSetters = true)
    private Set<LeagueTable> leagues = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserExtended id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public UserExtended firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public UserExtended lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public UserExtended email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return this.status;
    }

    public UserExtended status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getInstitution() {
        return this.institution;
    }

    public UserExtended institution(String institution) {
        this.setInstitution(institution);
        return this;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getCourse() {
        return this.course;
    }

    public UserExtended course(String course) {
        this.setCourse(course);
        return this;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getDescription() {
        return this.description;
    }

    public UserExtended description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getPrivacy() {
        return this.privacy;
    }

    public UserExtended privacy(Boolean privacy) {
        this.setPrivacy(privacy);
        return this;
    }

    public void setPrivacy(Boolean privacy) {
        this.privacy = privacy;
    }

    public Boolean getDarkMode() {
        return this.darkMode;
    }

    public UserExtended darkMode(Boolean darkMode) {
        this.setDarkMode(darkMode);
        return this;
    }

    public void setDarkMode(Boolean darkMode) {
        this.darkMode = darkMode;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserExtended user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Friend> getFriends() {
        return this.friends;
    }

    public void setFriends(Set<Friend> friends) {
        if (this.friends != null) {
            this.friends.forEach(i -> i.setFriendshipTo(null));
        }
        if (friends != null) {
            friends.forEach(i -> i.setFriendshipTo(this));
        }
        this.friends = friends;
    }

    public UserExtended friends(Set<Friend> friends) {
        this.setFriends(friends);
        return this;
    }

    public UserExtended addFriends(Friend friend) {
        this.friends.add(friend);
        friend.setFriendshipTo(this);
        return this;
    }

    public UserExtended removeFriends(Friend friend) {
        this.friends.remove(friend);
        friend.setFriendshipTo(null);
        return this;
    }

    public StudySession getStudySession() {
        return this.studySession;
    }

    public void setStudySession(StudySession studySession) {
        this.studySession = studySession;
    }

    public UserExtended studySession(StudySession studySession) {
        this.setStudySession(studySession);
        return this;
    }

    public Set<LeagueTable> getLeagues() {
        return this.leagues;
    }

    public void setLeagues(Set<LeagueTable> leagueTables) {
        if (this.leagues != null) {
            this.leagues.forEach(i -> i.removeMembers(this));
        }
        if (leagueTables != null) {
            leagueTables.forEach(i -> i.addMembers(this));
        }
        this.leagues = leagueTables;
    }

    public UserExtended leagues(Set<LeagueTable> leagueTables) {
        this.setLeagues(leagueTables);
        return this;
    }

    public UserExtended addLeagues(LeagueTable leagueTable) {
        this.leagues.add(leagueTable);
        leagueTable.getMembers().add(this);
        return this;
    }

    public UserExtended removeLeagues(LeagueTable leagueTable) {
        this.leagues.remove(leagueTable);
        leagueTable.getMembers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserExtended)) {
            return false;
        }
        return id != null && id.equals(((UserExtended) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserExtended{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", status='" + getStatus() + "'" +
            ", institution='" + getInstitution() + "'" +
            ", course='" + getCourse() + "'" +
            ", description='" + getDescription() + "'" +
            ", privacy='" + getPrivacy() + "'" +
            ", darkMode='" + getDarkMode() + "'" +
            "}";
    }
}
